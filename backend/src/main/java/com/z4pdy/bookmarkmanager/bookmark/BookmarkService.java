package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserRepository;

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
    
}
