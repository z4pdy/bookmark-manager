package com.z4pdy.bookmarkmanager.user;

public record RegisterUserRequest(
    String username,
    String email,
    String password
) {}
