package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.z4pdy.bookmarkmanager.bookmark.dto.BookmarkResponse;
import com.z4pdy.bookmarkmanager.bookmark.dto.CreateBookmarkRequest;
import com.z4pdy.bookmarkmanager.bookmark.dto.UpdateBookmarkRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping("{username}")
    public List<BookmarkResponse> getBookmarksByUsername(@PathVariable String username) {
        return bookmarkService.getBookmarksByUsername(username);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createBookmark(Authentication authentication, @Valid @RequestBody CreateBookmarkRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        bookmarkService.create(userId, request);
    }

    @DeleteMapping("{bookmarkId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBookmark(Authentication authentication, @PathVariable Long bookmarkId) {
        Long userId = (Long) authentication.getPrincipal();
        bookmarkService.delete(userId, bookmarkId);
    }

    @PutMapping("{bookmarkId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateBookmark(Authentication authentication, @PathVariable Long bookmarkId, @Valid @RequestBody UpdateBookmarkRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        bookmarkService.update(userId, bookmarkId, request);
    }
}
