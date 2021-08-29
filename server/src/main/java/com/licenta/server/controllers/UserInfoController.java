package com.licenta.server.controllers;
import java.util.*;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.licenta.server.models.ERole;
import com.licenta.server.models.Role;
import com.licenta.server.models.User;
import com.licenta.server.models.UserInfo;
import com.licenta.server.payload.request.LoginRequest;
import com.licenta.server.payload.request.SignupRequest;
import com.licenta.server.payload.response.JwtResponse;
import com.licenta.server.payload.response.MessageResponse;
import com.licenta.server.payload.response.UserInfoDTO;
import com.licenta.server.repositories.RoleRepository;
import com.licenta.server.repositories.UserInfoRepository;
import com.licenta.server.repositories.UserRepository;
import com.licenta.server.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UserInfoController {

    @Autowired
    UserInfoRepository userinfoRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDTO>> getUsers() {
        try {
            List<UserInfoDTO> users = new ArrayList<>();

            userinfoRepository.findAll().forEach(userData->{
                users.add(new UserInfoDTO(userData.getId(),userData.getUser().getUsername(),userData.getFirst_name(),userData.getLast_name(),userData.getDescription(),userData.getSpeed(),userData.getLatitude(),userData.getLongitude(),userData.getDistance()));
            });

            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        /*
    @GetMapping("/user/{id}")
    public ResponseEntity<UserInfoDTO> getUserInfoById(@PathVariable("id") long id) {
        //System.out.println(id);
        Optional<UserInfo> userData = userinfoRepository.findById(id);

        if (userData.isPresent()) {
            return new ResponseEntity<>(new UserInfoDTO(userData.get().getId(),userData.get().getUser().getUsername(),userData.get().getFirst_name(),userData.get().getLast_name(),userData.get().getDescription(),userData.get().getSpeed()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    */
    @GetMapping("/users/{username}")
    public ResponseEntity<UserInfoDTO> getUserInfoByUsername(@PathVariable("username") String username) {
        //System.out.println(id);
        Optional<UserInfo> userData = userinfoRepository.findByUserUsername(username);

        if (userData.isPresent()) {
            return new ResponseEntity<>(new UserInfoDTO(userData.get().getId(),userData.get().getUser().getUsername(),userData.get().getFirst_name(),userData.get().getLast_name(),userData.get().getDescription(),userData.get().getSpeed(),userData.get().getLatitude(),userData.get().getLongitude(),userData.get().getDistance()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserInfo> updateUserInfo(@PathVariable("id") long id, @RequestBody UserInfo info) {
        Optional<UserInfo> userData = userinfoRepository.findById( id);

        if (userData.isPresent()) {
            UserInfo _info = userData.get();
            _info.setFirst_name(info.getFirst_name());
            _info.setDescription(info.getDescription());
            _info.setLast_name(info.getLast_name());
            _info.setSpeed(info.getSpeed());
            _info.setLatitude(info.getLatitude());
            _info.setLongitude(info.getLongitude());
            _info.setDistance(info.getDistance());
            return new ResponseEntity<>(userinfoRepository.save(_info), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> deleteUserInfo(@PathVariable("id") long id) {
        try {
            userinfoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   
}