@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MVN_CMD=mvn") ELSE (SET "MVN_CMD=%__MVNW_ARG0_NAME__%")

@SET "JAVA_HOME=%JAVA_HOME%"
@SET "MAVEN_WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"
@SET "MAVEN_WRAPPER_PROPERTIES=%~dp0.mvn\wrapper\maven-wrapper.properties"

@IF NOT EXIST "%MAVEN_WRAPPER_JAR%" (
    @ECHO Downloading maven-wrapper.jar from Maven Central...
    @powershell -Command "$url='https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar'; Invoke-WebRequest -Uri $url -OutFile '%MAVEN_WRAPPER_JAR%'"
)

@java -jar "%MAVEN_WRAPPER_JAR%" %*
