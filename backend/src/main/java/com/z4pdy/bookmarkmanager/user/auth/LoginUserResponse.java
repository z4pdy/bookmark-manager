package com.z4pdy.bookmarkmanager.user.auth;

public record LoginUserResponse(
    String username,
    String token,
    boolean isPublic
) {}

