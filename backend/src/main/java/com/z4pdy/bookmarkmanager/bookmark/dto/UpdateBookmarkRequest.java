package com.z4pdy.bookmarkmanager.bookmark.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateBookmarkRequest(
    @NotNull(message = "Category is required")
    String category,
    @NotBlank(message = "Title is required")
    String title,
    @NotBlank(message = "Url is required")
    String url
) {}
