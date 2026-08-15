package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public List<Bookmark> getAllBookmarks() {
        return bookmarkService.getAll();
    }

    @GetMapping("{username}")
    public List<BookmarkResponse> getBookmarksByUsername(@PathVariable String username) {
        return bookmarkService.getBookmarksByUsername(username);
    }

    @PostMapping("{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void createBookmark(@PathVariable Long userId, @RequestBody CreateBookmarkRequest request) {
        bookmarkService.create(userId, request);
    }

}
