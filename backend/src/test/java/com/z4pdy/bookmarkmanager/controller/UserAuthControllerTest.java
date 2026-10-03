package com.z4pdy.bookmarkmanager.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.doThrow;

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
    void shouldReturnBadRequestForInvalidRequest() throws Exception {
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
    void shouldReturnBadRequestWhenEmailIsInvalid() throws Exception {
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
    void shouldReturnConflictWhenEmailOrUsernameIsTaken() throws Exception {
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
}
