package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserRepository;

import jakarta.validation.Valid;

@Service
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
    }

    public List<Bookmark> getAll() {
        return bookmarkRepository.findAll();
    }

	public void create(Long userId, CreateBookmarkRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + userId)
        );
        Bookmark bookmark = new Bookmark(
            request.category(),
            request.title(),
            request.url(),
            user
        );
        bookmarkRepository.save(bookmark);
	}

	public List<BookmarkResponse> getBookmarksByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User " + username + " not found")
        );

        return bookmarkRepository.findByUser(user).stream().map(bookmark ->
            new BookmarkResponse(
                bookmark.getId(),
                bookmark.getCategory(),
                bookmark.getTitle(),
                bookmark.getUrl()
            )
        ).toList();
	}

	public void delete(Long userId, Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).orElseThrow(() -> 
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found with id: " + bookmarkId)
        );

        if (!bookmark.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete this bookmark");
        }
        bookmarkRepository.delete(bookmark);
	}

    @Transactional
	public void update(Long userId, Long bookmarkId, @Valid UpdateBookmarkRequest request) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId).orElseThrow(() -> 
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found with id: " + bookmarkId)
        );

        if (!bookmark.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this bookmark");
        }

        bookmark.setCategory(request.category());
        bookmark.setTitle(request.title());
        bookmark.setUrl(request.url());
	}
    
}
