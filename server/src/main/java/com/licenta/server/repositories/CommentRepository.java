package com.licenta.server.repositories;

import com.licenta.server.models.Comment;
import com.licenta.server.models.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByRouteId(Long route_id);
    List<Comment> findAllByUserId(Long user_id);
    Boolean deleteById(long id);

}
