package com.z4pdy.bookmarkmanager.user;

import jakarta.validation.constraints.NotNull;

public record UpdateUserIsPublicRequest(
    @NotNull(message = "isPublic is required")
    Boolean isPublic
) {}
