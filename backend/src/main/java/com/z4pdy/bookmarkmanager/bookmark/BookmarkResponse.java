package com.z4pdy.bookmarkmanager.bookmark;

public record BookmarkResponse(
    Long id,
    String category,
    String title,
    String url
) {}
