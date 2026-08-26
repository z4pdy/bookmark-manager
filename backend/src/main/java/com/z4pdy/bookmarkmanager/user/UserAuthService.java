package com.z4pdy.bookmarkmanager.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.config.JwtService;

@Service
public class UserAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

	public void register(RegisterUserRequest request) {
        User user = new User(
            request.username(),
            request.email(),
            passwordEncoder.encode(request.password())
        );
        userRepository.save(user);
	}

    public LoginUserResponse login(LoginUserRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.login(),
                    request.password()
                )
            );
        } 
        catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(userPrincipal.getId());
        boolean isPublic = userRepository.getIsPublicByUsername(userPrincipal.getUsername());

        return new LoginUserResponse(
            userPrincipal.getUsername(),
            token,
            isPublic
        );
    }

}

