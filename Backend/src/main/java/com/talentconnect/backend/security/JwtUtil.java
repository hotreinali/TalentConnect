package com.talentconnect.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtUtil {

    // Base64-encoded 256-bit secret
    private static final String SECRET = "your-256-bit-base64-encoded-secret==";
    private static final long EXPIRATION = 24 * 60 * 60 * 1000L;

    // In-memory blacklist
    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    private Key getSigningKey() {
        byte[] keyBytes = SECRET.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String subject, List<String> roles) {
        return Jwts.builder()
                .setSubject(subject)
                .setClaims(Map.of("roles", roles))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        if (blacklist.containsKey(token)) {
            throw new JwtException("Token revoked");
        }
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public void blacklist(String token) {
        blacklist.put(token, new Date());
    }
}
