package com.licenta.server;

import com.licenta.server.models.User;
import com.licenta.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class mockup {
    private static UserRepository repo;
    @Autowired
    private mockup(UserRepository user)
    {
        mockup.repo=user;
    }
    public static void main(String[] args) {
        repo.save(new User("admin","admin","admin"));
    }

}
