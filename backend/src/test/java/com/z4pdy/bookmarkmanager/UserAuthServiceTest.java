package com.z4pdy.bookmarkmanager;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;

import com.z4pdy.bookmarkmanager.security.JwtService;
import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserPrincipal;
import com.z4pdy.bookmarkmanager.user.UserRepository;
import com.z4pdy.bookmarkmanager.user.auth.UserAuthService;
import com.z4pdy.bookmarkmanager.user.auth.dto.LoginUserRequest;
import com.z4pdy.bookmarkmanager.user.auth.dto.LoginUserResponse;
import com.z4pdy.bookmarkmanager.user.auth.dto.RegisterUserRequest;

@ExtendWith(MockitoExtension.class)
public class UserAuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private UserAuthService userAuthService;

    @Test
    void shouldThrowExceptionWhenEmailIsTakenDuringRegister() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        RegisterUserRequest request = new RegisterUserRequest("username", "test@example.com", "password");

        assertThrows(ResponseStatusException.class, () -> userAuthService.register(request));
    }

    @Test
    void shouldThrowExceptionWhenUsernameIsTakenDuringRegister() {
        when(userRepository.existsByUsername("username")).thenReturn(true);
        RegisterUserRequest request = new RegisterUserRequest("username", "test@example.com", "password");

        assertThrows(ResponseStatusException.class, () -> userAuthService.register(request));
    }

    @Test
    void shouldRegisterUser() {
        RegisterUserRequest request = new RegisterUserRequest("username", "test@example.com", "password");
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        userAuthService.register(request);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldEncodePasswordBeforeRegister() {
        RegisterUserRequest request = new RegisterUserRequest("username", "test@example.com", "password");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        userAuthService.register(request);

        verify(passwordEncoder).encode("password");
    }

    @Test
    void shouldThrowExceptionWhenCredentialsAreInvalidDuringLogin() {
        LoginUserRequest request = new LoginUserRequest("test@example.com", "password");
        when(authenticationManager.authenticate(any())).thenThrow(BadCredentialsException.class);

        assertThrows(ResponseStatusException.class, () -> userAuthService.login(request));
    }

    @Test
    void shouldLoginUser() {
        LoginUserRequest request = new LoginUserRequest("test@example.com", "password");
        Authentication authentication = mock(Authentication.class);
        UserPrincipal userPrincipal = new UserPrincipal(1L, "username", "encodedPassword");
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(jwtService.generateToken(1L)).thenReturn("test-token");
        LoginUserResponse response = userAuthService.login(request);

        assertEquals("username", response.username());
        assertEquals("test-token", response.token());
    }
}
