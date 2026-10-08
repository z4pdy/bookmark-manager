package com.z4pdy.bookmarkmanager.controller;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.security.JwtService;
import com.z4pdy.bookmarkmanager.user.auth.UserAuthController;
import com.z4pdy.bookmarkmanager.user.auth.UserAuthService;
import com.z4pdy.bookmarkmanager.user.auth.dto.LoginUserRequest;
import com.z4pdy.bookmarkmanager.user.auth.dto.LoginUserResponse;
import com.z4pdy.bookmarkmanager.user.auth.dto.RegisterUserRequest;

@WebMvcTest(UserAuthController.class)
public class UserAuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private UserAuthService userAuthService;

    @Test
    void shouldRegisterUser() throws Exception {
        mockMvc.perform(
            post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "username": "username",
                    "email": "test@example.com",
                    "password": "password"
                }
            """)
        ).andExpect(status().isCreated());

        verify(userAuthService).register(any(RegisterUserRequest.class));
    }

    @Test
    void shouldReturnBadRequestForInvalidRequestWhenRegister() throws Exception {
        mockMvc.perform(
            post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(""" 
                {
                    "username": "",
                    "password": ""
                }
            """)
        ).andExpect(status().isBadRequest());

        verifyNoInteractions(userAuthService);
    }

    @Test
    void shouldReturnBadRequestWhenEmailIsInvalidWhenRegister() throws Exception {
        mockMvc.perform(
            post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "username": "username",
                    "email": "invalid email",
                    "password": "password"
                }
            """)
        ).andExpect(status().isBadRequest());

        verifyNoInteractions(userAuthService);
    }

    @Test
    void shouldReturnConflictWhenEmailOrUsernameIsTakenWhenRegister() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.CONFLICT))
        .when(userAuthService)
        .register(any(RegisterUserRequest.class));

        mockMvc.perform(
            post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "username": "takenusername",
                    "email": "test@example.com",
                    "password": "password"
                }
            """)
        ).andExpect(status().isConflict());

        verify(userAuthService).register(any(RegisterUserRequest.class));
    }

    @Test
    void shouldLoginUser() throws Exception {
        LoginUserResponse response = new LoginUserResponse(
            "username",
            "jwt-token",
            true
        );

        when(userAuthService.login(any(LoginUserRequest.class))).thenReturn(response);

        mockMvc.perform(
            post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "login": "username",
                    "password": "password"
                }
            """)
        ).andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("username"))
        .andExpect(jsonPath("$.token").value("jwt-token"))
        .andExpect(jsonPath("$.isPublic").value(true));

        verify(userAuthService).login(any(LoginUserRequest.class));
    }

    @Test
    void shouldReturnBadRequestForInvalidRequestWhenLogin() throws Exception {
        mockMvc.perform(
            post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "login": ""
                }
            """)
        ).andExpect(status().isBadRequest());

        verifyNoInteractions(userAuthService);
    }

    @Test
    void shouldReturnUnauthorizedWhenCredentialsAreInvalidWhenLogin() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED)).when(userAuthService).login(any(LoginUserRequest.class));

        mockMvc.perform(
            post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "login": "username",
                    "password": "password"
                }
            """)
        ).andExpect(status().isUnauthorized());
    }

}
