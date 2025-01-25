package com.egame.backend.services;

import com.egame.backend.models.Users;
import com.egame.backend.repositories.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if user is banned
        if (user.getBanned()) {
            String banMessage = null;  // Initialize here
            if (user.getBanExpiration() == null) {
                banMessage = "Your account has been permanently banned";
            } else if (LocalDateTime.now().isBefore(user.getBanExpiration())) {
                banMessage = "Your account is banned until " + user.getBanExpiration();
            } else {
                // If ban has expired, unban the user
                user.setBanned(false);
                user.setBanExpiration(null);
                userRepository.save(user);
                // Continue with login
            }
            
            // If we have a ban message, throw exception
            if (banMessage != null) {
                throw new DisabledException(banMessage);
            }
        }

        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getValue())))
            .accountLocked(false)  // We handle locking through DisabledException
            .build();
    }

    public void banUser(Long id, LocalDateTime expirationTime) {
        userRepository.findById(id).ifPresent(user -> {
            user.setBanned(true);
            user.setBanExpiration(expirationTime);
            userRepository.save(user);
        });
    }

    public void unbanUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setBanned(false);
            user.setBanExpiration(null);
            userRepository.save(user);
        });
    }

    public Optional<Users> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<Users> findAll() {
        return userRepository.findAll();
    }
    public Optional<Users> findById(Long id) {
        return userRepository.findById(id);
    }
}
