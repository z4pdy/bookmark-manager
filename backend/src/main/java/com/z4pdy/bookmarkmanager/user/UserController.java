package com.z4pdy.bookmarkmanager.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.z4pdy.bookmarkmanager.user.dto.UpdateUserIsPublicRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/is-public")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateIsPublic(Authentication authentication, @Valid @RequestBody UpdateUserIsPublicRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        userService.updateIsPublic(userId, request.isPublic());
    }
}
