package com.z4pdy.bookmarkmanager.bookmark;

public record CreateBookmarkRequest(
    String category,
    String title,
    String url
) {}
