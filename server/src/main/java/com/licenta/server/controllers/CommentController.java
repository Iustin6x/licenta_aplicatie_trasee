package com.licenta.server.controllers;


import com.licenta.server.models.Comment;
import com.licenta.server.repositories.CommentRepository;
import com.licenta.server.repositories.RouteRepository;
import com.licenta.server.repositories.UserInfoRepository;
import com.licenta.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    UserInfoRepository userinfoRepository;

    @Autowired
    RouteRepository routeRepository;

    @Autowired
    CommentRepository commentRepository;


    @Autowired
    UserRepository userRepository;


    @GetMapping("/route/{id}")
    public ResponseEntity<List<Comment>> getCommentsByRouteId(@PathVariable("id") Long id) {
        try {
            List<Comment> comments = new ArrayList<Comment>();

            commentRepository.findAllByRouteId(id).forEach(comments::add);


            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable("id") Long id) {
        try {
            List<Comment> comments = new ArrayList<Comment>();

            commentRepository.findAllByRouteId(id).forEach(comments::add);


            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/")
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        try {
            Comment _comm = commentRepository
                    .save(comment);
            return new ResponseEntity<>(_comm, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteComment(@PathVariable("id") long id) {
        try {
            commentRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}