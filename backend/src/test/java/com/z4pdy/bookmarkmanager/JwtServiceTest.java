package com.z4pdy.bookmarkmanager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.z4pdy.bookmarkmanager.security.JwtService;

import java.util.Date;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtServiceTest {
    JwtService jwtService;
    String secret;
    
    @BeforeEach
    void setUp() {
        secret = "VGhpc0lzQVN1ZmZpY2llbnRseUxvbmdTZWNyZXRGb3JUZXN0aW5nMTIzNDU";
        jwtService = new JwtService(secret);
    }

    @Test
    void shouldGenerateToken() {
        String token = jwtService.generateToken(1L);
        assertNotNull(token);
    }

    @Test
    void shouldGenerateTokenWithCorrectUserId() {
        String token = jwtService.generateToken(1L);
        assertEquals(1L, jwtService.getUserId(token)); 
    }

    @Test
    void shouldRejectInvalidToken() {
        assertThrows(JwtException.class, () -> jwtService.getUserId("invalid-token"));
    }

    @Test
    void shouldRejectExpiredToken() {
        String token = Jwts.builder()
            .subject("1")
            .issuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 2))
            .expiration(new Date(System.currentTimeMillis() - 1000 * 60))
            .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
            .compact();
        assertThrows(JwtException.class, () -> jwtService.getUserId(token));
    }

    @Test
    void shouldRejectTokenSignedWithDifferentSecret() {
        String differentSecret = "VGhpc0lzQVN1ZmZpY2llbnRseUxvbmdTZWNyZXRGb3JUZXN0aW5nMTIzNDu"; 
        String token = Jwts.builder()
            .subject("1")
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(differentSecret)))
            .compact();
        assertThrows(JwtException.class, () -> jwtService.getUserId(token));
    }
}
