package com.z4pdy.bookmarkmanager.user;

public record LoginUserRequest(
    String login,
    String password
) {}
