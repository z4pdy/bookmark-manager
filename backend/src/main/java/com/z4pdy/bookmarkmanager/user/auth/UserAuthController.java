package com.z4pdy.bookmarkmanager.user.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class UserAuthController {
    private final UserAuthService userAuthService;

    public UserAuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterUserRequest request) {
        userAuthService.register(request);
    }
    
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginUserResponse login(@Valid @RequestBody LoginUserRequest request) {
        return userAuthService.login(request);
    }
}
