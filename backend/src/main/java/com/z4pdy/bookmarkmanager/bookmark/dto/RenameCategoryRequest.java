package com.z4pdy.bookmarkmanager.bookmark.dto;

import jakarta.validation.constraints.NotNull;

public record RenameCategoryRequest(
    @NotNull(message = "Category is required")
    String category,
    @NotNull(message = "New category is required")
    String newCategory
) {}
