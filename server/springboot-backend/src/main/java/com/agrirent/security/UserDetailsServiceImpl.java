package com.agrirent.security;

import com.agrirent.entity.User;
import com.agrirent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return buildUserDetails(user);
    }

    /**
     * Load by ID (used in JWT filter where we have userId from token claims).
     */
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + id));

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        String roleStr = user.getRole() != null ? user.getRole().name().toUpperCase() : "USER";
        if ("FARMER".equals(roleStr)) {
            roleStr = "USER";
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + roleStr)))
                .build();
    }
}
