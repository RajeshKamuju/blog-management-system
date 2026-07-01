package com.blogsphere.security;

import com.blogsphere.entity.User;
import com.blogsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try locating by email first, fallback to username
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail)));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
        Set<GrantedAuthority> authorities = Collections.singleton(authority);

        return new org.springframework.security.core.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
