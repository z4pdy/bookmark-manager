package com.z4pdy.bookmarkmanager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.bookmark.Bookmark;
import com.z4pdy.bookmarkmanager.bookmark.BookmarkRepository;
import com.z4pdy.bookmarkmanager.bookmark.BookmarkService;
import com.z4pdy.bookmarkmanager.bookmark.dto.BookmarkResponse;
import com.z4pdy.bookmarkmanager.bookmark.dto.CreateBookmarkRequest;
import com.z4pdy.bookmarkmanager.bookmark.dto.RenameCategoryRequest;
import com.z4pdy.bookmarkmanager.bookmark.dto.UpdateBookmarkRequest;
import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserRepository;

@ExtendWith(MockitoExtension.class)
public class BookmarkServiceTest {
    @Mock
    private BookmarkRepository bookmarkRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private BookmarkService bookmarkService;

    @Test
    void shouldThrowExceptionWhenUserDoesNotExistWhenCreatingBookmark() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        CreateBookmarkRequest request = 
            new CreateBookmarkRequest("category", "title", "url");
        assertThrows(ResponseStatusException.class, () -> bookmarkService.create(1L, request));
    }

    @Test
    void shouldCreateBookmark() {
        User user = new User("username", "email", "password");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        CreateBookmarkRequest request = 
            new CreateBookmarkRequest("category", "title", "url");
        bookmarkService.create(1L, request);

        verify(bookmarkRepository).save(any(Bookmark.class));
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExistWhenGettingBookmarks() {
        when(userRepository.findByUsername("nonExistingUsername")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> bookmarkService.getBookmarksByUsername("nonExistingUsername"));
    }

    @Test
    void shouldReturnBookmarks() {
        User user = new User("username", "email", "password");
        when(userRepository.findByUsername("username")).thenReturn(Optional.of(user));

        Bookmark bookmark1 = new Bookmark("category1", "title1", "url1", user);
        Bookmark bookmark2 = new Bookmark("category2", "title2", "url2", user);

        List<Bookmark> bookmarks = new ArrayList<>(List.of(bookmark1, bookmark2));

        when(bookmarkRepository.findByUser(user)).thenReturn(bookmarks);

        List<BookmarkResponse> result = bookmarkService.getBookmarksByUsername("username");
        assertEquals(2, result.size());
    }

    @Test
    void shouldThrowExceptionWhenBookmarkDoesNotBelongToUserWhenDeletingBookmarks() {
        User user1 = new User("username1", "email1", "password1");
        ReflectionTestUtils.setField(user1, "id", 1L);

        Bookmark bookmark = new Bookmark("category", "title", "url", user1);
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.of(bookmark));

        assertThrows(ResponseStatusException.class, () -> bookmarkService.delete(2L, 9L));
    }

    @Test
    void shouldThrowExceptionWhenBookmarkDoesNotExistWhenDeletingBookmarks() {
        User user = new User("username", "email", "password");
        ReflectionTestUtils.setField(user, "id", 1L);
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> bookmarkService.delete(1L, 9L));
    }

    @Test
    void shouldDeleteBookmark() {
        User user = new User("username", "email", "password");
        ReflectionTestUtils.setField(user, "id", 1L);

        Bookmark bookmark = new Bookmark("category", "title", "url", user);
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.of(bookmark));
        bookmarkService.delete(1L, 9L);

        verify(bookmarkRepository).delete(bookmark);
    }

    @Test
    void shouldUpdateBookmark() {
        User user = new User("username", "email", "password");
        ReflectionTestUtils.setField(user, "id", 1L);

        Bookmark bookmark = new Bookmark("oldCategory", "oldTitle", "oldUrl", user);
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.of(bookmark));

        UpdateBookmarkRequest request = new UpdateBookmarkRequest("newCategory", "newTitle", "newUrl");

        bookmarkService.update(1L, 9L, request);

        assertEquals("newCategory", bookmark.getCategory());
        assertEquals("newTitle", bookmark.getTitle());
        assertEquals("newUrl", bookmark.getUrl());
    }

    @Test
    void shouldThrowExceptionWhenBookmarkDoesNotExistWhenUpdatingBookmark() {
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.empty());
        UpdateBookmarkRequest request = new UpdateBookmarkRequest("newCategory", "newTitle", "newUrl");

        assertThrows(ResponseStatusException.class, () -> bookmarkService.update(1L, 9L, request));
    }

    @Test
    void shouldThrowExceptionWhenBookmarkDoesNotBelongToUserWhenUpdatingBookmark() {
        User user = new User("username", "email", "password");
        ReflectionTestUtils.setField(user, "id", 1L);

        Bookmark bookmark = new Bookmark("category", "title", "url", user);
        when(bookmarkRepository.findById(9L)).thenReturn(Optional.of(bookmark));

        UpdateBookmarkRequest request = new UpdateBookmarkRequest("newCategory", "newTitle", "newUrl");

        assertThrows( ResponseStatusException.class, () -> bookmarkService.update(2L, 9L, request));
    }

    @Test
    void shouldRenameCategory() {
        RenameCategoryRequest request = new RenameCategoryRequest("oldCategory", "newCategory");
        bookmarkService.renameCategory(1L, request);
        verify(bookmarkRepository).renameCategory(1L, "oldCategory", "newCategory");
    }

}
