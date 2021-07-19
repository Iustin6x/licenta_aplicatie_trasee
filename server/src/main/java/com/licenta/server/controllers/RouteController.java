package com.licenta.server.controllers;

import com.licenta.server.models.Route;
import com.licenta.server.repositories.RouteRepository;
import com.licenta.server.repositories.UserInfoRepository;
import com.licenta.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class RouteController {

    @Autowired
    UserInfoRepository userinfoRepository;

    @Autowired
    RouteRepository routeRepository;


    @Autowired
    UserRepository userRepository;
    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        try {
            List<Route> routes = new ArrayList<Route>();

            routeRepository.findAll().forEach(routes::add);

            if (routes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(routes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/routes/{username}/{type}")
    public ResponseEntity<List<Route>> getRoutesByUsername(@PathVariable("username") String username,@PathVariable("type") String type) {
        try {
            List<Route> routes = new ArrayList<Route>();
            if (type.equals("all"))
                routeRepository.findAllByUserUsername(username).forEach(routes::add);
            else
                routeRepository.findAllByUserUsernameAndType(username,type).forEach(routes::add);


            if (routes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(routes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/routes/followers/{id}")
    public ResponseEntity<List<Route>> getRoutesByFollower(@PathVariable("id") Long id) {
        try {
            List<Route> routes = new ArrayList<Route>();

            routeRepository.findAllByFollowersId(id).forEach(routes::add);


            if (routes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(routes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/routes/done")
    public ResponseEntity<List<Route>> getAllDoneRoutes() {
        try {
            List<Route> routes = new ArrayList<Route>();

                routeRepository.findAllByType("done").forEach(routes::add);

            if (routes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(routes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/routes/planned")
    public ResponseEntity<List<Route>> getAllPlannedRoutes(@RequestParam(required = false) String type) {
        try {
            List<Route> routes = new ArrayList<Route>();


                routeRepository.findAllByType("planned").forEach(routes::add);

            if (routes.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(routes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/routes")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        try {
            System.out.println(route);
            Route _route = routeRepository
                    .save(route);
            return new ResponseEntity<>(_route, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/routes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteRoute(@PathVariable("id") long id) {
        try {
            routeRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}