package com.codereview.backend.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.codereview.backend.model.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Review> findTop5ByUserIdOrderByCreatedAtDesc(String userId);
    
    Long countByUserId(String userId);
}