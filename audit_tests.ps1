param()
$base = "http://localhost:8080"
$tmp = "$env:TEMP\agrirent_test"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$ts = Get-Random -Min 10000 -Max 99999
$farmerEmail = "auditfarmer${ts}@agrirent.com"
$ownerEmail = "auditowner${ts}@agrirent.com"

function ApiCall {
    param($url, $method = "GET", $bodyFile = $null, $token = $null)
    $curlArgs = @("--silent", "--max-time", "15", "-w", "`nHTTPSTATUS:%{http_code}", "-X", $method)
    if ($bodyFile) { $curlArgs += @("-H", "Content-Type: application/json", "--data", "@$bodyFile") }
    if ($token) { $curlArgs += @("-H", "Authorization: Bearer $token") }
    $curlArgs += $url
    $raw = & curl.exe @curlArgs 2>&1
    $rawStr = $raw -join "`n"
    $match = [regex]::Match($rawStr, 'HTTPSTATUS:(\d+)')
    $status = if ($match.Success) { [int]$match.Groups[1].Value } else { 0 }
    $body = $rawStr -replace 'HTTPSTATUS:\d+', '' -replace '^\s+', ''
    $json = $null
    try { $json = $body | ConvertFrom-Json } catch {}
    return [PSCustomObject]@{ Code = $status; Body = $body; Json = $json }
}

function WJ($path, $content) { [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8) }

Write-Output "============================================"
Write-Output "AgriRent Full API Audit | TS=$ts"
Write-Output "Backend: $base"
Write-Output "Farmer: $farmerEmail"
Write-Output "Owner: $ownerEmail"
Write-Output "============================================"

Write-Output "`n=== 1. REGISTRATION TESTS ==="

WJ "$tmp\rf.json" "{`"name`":`"AuditFarmer`",`"email`":`"$farmerEmail`",`"password`":`"Password123`",`"phone`":`"9100000001`",`"role`":`"farmer`",`"location`":`"Trichy`"}"
$r = ApiCall "$base/api/auth/register" "POST" "$tmp\rf.json"
Write-Output "1. Valid Farmer Registration: HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\ro.json" "{`"name`":`"AuditOwner`",`"email`":`"$ownerEmail`",`"password`":`"Password123`",`"phone`":`"9100000002`",`"role`":`"owner`",`"location`":`"Chennai`"}"
$r = ApiCall "$base/api/auth/register" "POST" "$tmp\ro.json"
Write-Output "2. Valid Owner Registration: HTTP $($r.Code) | $($r.Json.message)"

$r = ApiCall "$base/api/auth/register" "POST" "$tmp\rf.json"
Write-Output "3. Duplicate Email (expect 400/409): HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\ren.json" "{`"name`":`"`",`"email`":`"emptyname${ts}@agrirent.com`",`"password`":`"Password123`",`"phone`":`"9100000003`",`"role`":`"farmer`",`"location`":`"Trichy`"}"
$r = ApiCall "$base/api/auth/register" "POST" "$tmp\ren.json"
Write-Output "4. Empty Name (expect 400): HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\rnr.json" "{`"name`":`"Test`",`"email`":`"norole${ts}@agrirent.com`",`"password`":`"Password123`",`"phone`":`"9100000004`",`"location`":`"Trichy`"}"
$r = ApiCall "$base/api/auth/register" "POST" "$tmp\rnr.json"
Write-Output "5. Missing Role (expect 400): HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\rep.json" "{`"name`":`"Test`",`"email`":`"nopass${ts}@agrirent.com`",`"password`":`"`",`"phone`":`"9100000005`",`"role`":`"farmer`",`"location`":`"Trichy`"}"
$r = ApiCall "$base/api/auth/register" "POST" "$tmp\rep.json"
Write-Output "6. Empty Password (expect 400): HTTP $($r.Code) | $($r.Json.message)"

Write-Output "`n=== 2. LOGIN TESTS ==="

WJ "$tmp\lf.json" "{`"email`":`"$farmerEmail`",`"password`":`"Password123`"}"
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\lf.json"
$farmerToken = $r.Json.data.token
Write-Output "1. Valid Farmer Login: HTTP $($r.Code) | Token=$(if($farmerToken){'YES'}else{'NO'})"

WJ "$tmp\lo.json" "{`"email`":`"$ownerEmail`",`"password`":`"Password123`"}"
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\lo.json"
$ownerToken = $r.Json.data.token
Write-Output "2. Valid Owner Login: HTTP $($r.Code) | Token=$(if($ownerToken){'YES'}else{'NO'})"

WJ "$tmp\lw.json" "{`"email`":`"$farmerEmail`",`"password`":`"wrongpass`"}"
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\lw.json"
Write-Output "3. Wrong Password (expect 400/401): HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\ln.json" "{`"email`":`"nobody@nobody.com`",`"password`":`"Password123`"}"
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\ln.json"
Write-Output "4. Non-existing User (expect 400/401): HTTP $($r.Code) | $($r.Json.message)"

WJ "$tmp\le.json" "{`"email`":`"`",`"password`":`"`"}"
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\le.json"
Write-Output "5. Empty Credentials (expect 400): HTTP $($r.Code) | $($r.Json.message)"

Write-Output "`n=== 3. SECURITY / ROLE TESTS ==="

$r = ApiCall "$base/api/equipment/my"
Write-Output "1. No token on /equipment/my (expect 403): HTTP $($r.Code)"

$r = ApiCall "$base/api/equipment/my" "GET" $null $farmerToken
Write-Output "2. Farmer on /equipment/my (expect 403): HTTP $($r.Code) | $($r.Json.message)"

$r = ApiCall "$base/api/equipment/my" "GET" $null $ownerToken
Write-Output "3. Owner on /equipment/my (expect 200): HTTP $($r.Code)"

WJ "$tmp\eq_ft.json" "{`"name`":`"T`",`"description`":`"T`",`"category`":`"Tractor`",`"pricePerDay`":100,`"location`":`"TN`",`"available`":true}"
$r = ApiCall "$base/api/equipment" "POST" "$tmp\eq_ft.json" $farmerToken
Write-Output "4. Farmer creating equipment (expect 403): HTTP $($r.Code)"

$r = ApiCall "$base/api/bookings/all" "GET" $null $farmerToken
Write-Output "5. Farmer accessing admin bookings (expect 403): HTTP $($r.Code)"

$r = ApiCall "$base/api/auth/profile" "GET" $null $farmerToken
Write-Output "6. Farmer accessing own profile: HTTP $($r.Code) | Role=$($r.Json.data.role)"

Write-Output "`n=== 4. EQUIPMENT CRUD TESTS ==="

WJ "$tmp\en.json" "{`"name`":`"Audit Tractor $ts`",`"description`":`"High-power tractor for audit`",`"category`":`"Tractor`",`"pricePerDay`":500,`"location`":`"Chennai`",`"available`":true}"
$r = ApiCall "$base/api/equipment" "POST" "$tmp\en.json" $ownerToken
$equipId = $r.Json.data.id
Write-Output "1. Create Equipment (owner): HTTP $($r.Code) | ID=$equipId | $($r.Json.message)"

$r = ApiCall "$base/api/equipment"
Write-Output "2. List Equipment (public): HTTP $($r.Code) | Count=$($r.Json.data.Count)"

if ($equipId) {
    $r = ApiCall "$base/api/equipment/$equipId"
    Write-Output "3. Get Equipment by ID (public): HTTP $($r.Code) | $($r.Json.data.name)"

    WJ "$tmp\eu.json" "{`"name`":`"Updated Tractor $ts`",`"description`":`"Updated desc`",`"category`":`"Tractor`",`"pricePerDay`":600,`"location`":`"Chennai`",`"available`":true}"
    $r = ApiCall "$base/api/equipment/$equipId" "PUT" "$tmp\eu.json" $ownerToken
    Write-Output "4. Update Equipment (owner): HTTP $($r.Code) | $($r.Json.data.name)"

    $r = ApiCall "$base/api/equipment/$equipId" "PUT" "$tmp\eu.json" $farmerToken
    Write-Output "5. Farmer update equipment (expect 403): HTTP $($r.Code)"

    $r = ApiCall "$base/api/equipment/my" "GET" $null $ownerToken
    Write-Output "6. Owner view my equipment: HTTP $($r.Code) | Count=$($r.Json.data.Count)"
}

Write-Output "`n=== 5. BOOKING FLOW TESTS ==="

if ($equipId) {
    $start = (Get-Date).AddDays(5).ToString("yyyy-MM-dd")
    $end   = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    WJ "$tmp\bk.json" "{`"equipmentId`":$equipId,`"startDate`":`"$start`",`"endDate`":`"$end`",`"notes`":`"Audit booking`"}"

    $r = ApiCall "$base/api/bookings" "POST" "$tmp\bk.json" $farmerToken
    $bookingId = $r.Json.data.id
    Write-Output "1. Create Booking (farmer): HTTP $($r.Code) | ID=$bookingId Status=$($r.Json.data.status)"

    $r = ApiCall "$base/api/bookings" "POST" "$tmp\bk.json" $ownerToken
    Write-Output "2. Owner creates booking (expect 403): HTTP $($r.Code)"

    if ($bookingId) {
        $r = ApiCall "$base/api/bookings/my" "GET" $null $farmerToken
        Write-Output "3. Farmer My Bookings: HTTP $($r.Code) | Count=$($r.Json.data.Count)"

        $r = ApiCall "$base/api/bookings/owner" "GET" $null $ownerToken
        Write-Output "4. Owner Bookings: HTTP $($r.Code) | Count=$($r.Json.data.Count)"

        $r = ApiCall "$base/api/bookings/$bookingId" "GET" $null $farmerToken
        Write-Output "5. Get Booking by ID: HTTP $($r.Code) | Status=$($r.Json.data.status)"

        $r = ApiCall "$base/api/bookings/$bookingId/approve" "PUT" $null $ownerToken
        Write-Output "6. Approve Booking (owner): HTTP $($r.Code) | Status=$($r.Json.data.status)"

        $r = ApiCall "$base/api/bookings/$bookingId/cancel" "PUT" $null $farmerToken
        Write-Output "7. Cancel Booking (farmer): HTTP $($r.Code) | Status=$($r.Json.data.status)"

        $r = ApiCall "$base/api/bookings/$bookingId/reject" "PUT" $null $farmerToken
        Write-Output "8. Farmer reject booking (expect 403): HTTP $($r.Code)"
    }

    # Cleanup
    $r = ApiCall "$base/api/equipment/$equipId" "DELETE" $null $ownerToken
    Write-Output "`nCleanup Delete Equipment: HTTP $($r.Code) | $($r.Json.message)"
}

Write-Output "`n=== 6. CORS TESTS ==="
$corsOut = & curl.exe --silent --max-time 10 -i -X OPTIONS `
    -H "Origin: http://10.115.96.34:5173" `
    -H "Access-Control-Request-Method: POST" `
    -H "Access-Control-Request-Headers: Content-Type" `
    "$base/api/auth/register" 2>&1
$corsStr = $corsOut -join "`n"
$statusLine = ($corsOut | Where-Object { $_ -match "^HTTP" }) | Select-Object -First 1
$acao = ($corsOut | Where-Object { $_ -match "Access-Control-Allow-Origin:" }) | Select-Object -First 1
$acac = ($corsOut | Where-Object { $_ -match "Access-Control-Allow-Credentials:" }) | Select-Object -First 1
Write-Output "LAN CORS Preflight: $($statusLine.Trim())"
Write-Output "ACAO Header: $($acao.Trim())"
Write-Output "ACAC Header: $($acac.Trim())"

Write-Output "`n=== 7. VITE PROXY TESTS ==="
$r = & curl.exe --silent --max-time 15 -w "`nHTTPSTATUS:%{http_code}" http://localhost:5173/api/health 2>&1
Write-Output "Localhost proxy health: $r"
$r = & curl.exe --silent --max-time 15 -w "`nHTTPSTATUS:%{http_code}" http://10.115.96.34:5173/api/health 2>&1
Write-Output "LAN proxy health: $r"

Write-Output "`n=== 8. DATABASE PERSISTENCE TEST ==="
# Login and verify DB persisted our audit user
$r = ApiCall "$base/api/auth/login" "POST" "$tmp\lf.json"
Write-Output "Re-login Farmer after all ops: HTTP $($r.Code) | ID=$($r.Json.data.id) Name=$($r.Json.data.name)"

Write-Output "`n============ AUDIT COMPLETE ============"
