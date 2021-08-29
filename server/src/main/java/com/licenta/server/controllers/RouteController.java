package com.licenta.server.controllers;

import com.licenta.server.models.Route;
import com.licenta.server.models.UserInfo;
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
import java.util.Optional;

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
            //TO-DO sa mearga
            if(_route.getType().equals("done")) {
                System.out.println("donee");
                Optional<UserInfo> userData = userinfoRepository.findById(route.getUser().getId());

                if (userData.isPresent()) {
                    UserInfo _info = userData.get();
                    _info.setDistance(_info.getDistance() + route.getDistance());
                    _info.setSpeed((_info.getSpeed() + route.getSpeed()) / 2);

                    userinfoRepository.save(_info);
                }
            }
            return new ResponseEntity<>(_route, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/routes/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Route> updateRoute(@PathVariable("id") long id, @RequestBody Route route) {
        Optional<Route> data = routeRepository.findById( id);

        if (data.isPresent()) {
            Route _route = data.get();
            _route.setDescription(route.getDescription());
            _route.setSpeed(route.getSpeed());
            _route.setDistance(route.getDistance());
            _route.setName(route.getName());
            _route.setFollowers(route.getFollowers());
            return new ResponseEntity<>(routeRepository.save(_route), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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