package com.z4pdy.bookmarkmanager.bookmark.dto;

public record BookmarkResponse(
    Long id,
    String category,
    String title,
    String url
) {}
