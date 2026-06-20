package com.codereview.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.codereview.backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByUsername(String username);
}