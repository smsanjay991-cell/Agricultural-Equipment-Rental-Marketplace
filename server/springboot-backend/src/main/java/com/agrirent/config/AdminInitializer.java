package com.agrirent.config;

import com.agrirent.entity.User;
import com.agrirent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Initializes the first administrative account if no admin exists in the database.
 * The administrator's credentials are provided securely via environment variables:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 * Passwords are encrypted using BCrypt.
 * If an admin account already exists, initialization is skipped to prevent duplicate accounts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@agrirent.com}")
    private String adminEmail;

    @Value("${admin.password:Password123}")
    private String adminPassword;

    @Value("${admin.name:System Administrator}")
    private String adminName;

    @Value("${admin.phone:+91 99999 99999}")
    private String adminPhone;

    @Override
    public void run(String... args) {
        String effectiveEmail = StringUtils.hasText(adminEmail) ? adminEmail.trim().toLowerCase() : "admin@agrirent.com";
        String effectivePassword = StringUtils.hasText(adminPassword) ? adminPassword.trim() : "Password123";

        // Check if an admin already exists in the database
        boolean adminExists = userRepository.existsByRole(User.Role.admin);
        if (adminExists) {
            log.info("Admin account already exists in database. Verifying admin credentials...");
            userRepository.findByEmailIgnoreCase(effectiveEmail).ifPresent(existingAdmin -> {
                if (existingAdmin.getRole() == User.Role.admin) {
                    if (!passwordEncoder.matches(effectivePassword, existingAdmin.getPassword()) &&
                        !passwordEncoder.matches("password123", existingAdmin.getPassword())) {
                        existingAdmin.setPassword(passwordEncoder.encode(effectivePassword));
                        userRepository.save(existingAdmin);
                        log.info("Synchronized admin password for {}", effectiveEmail);
                    }
                }
            });
            return;
        }

        // If no admin exists, create the default administrator account
        User adminUser = User.builder()
                .name(StringUtils.hasText(adminName) ? adminName.trim() : "System Administrator")
                .email(effectiveEmail)
                .password(passwordEncoder.encode(effectivePassword))
                .phone(StringUtils.hasText(adminPhone) ? adminPhone.trim() : "+91 99999 99999")
                .role(User.Role.admin)
                .location("Central Platform HQ")
                .avatar("")
                .build();

        userRepository.save(adminUser);
        log.info("Initial Administrator account successfully created with email: {}", effectiveEmail);
    }
}

