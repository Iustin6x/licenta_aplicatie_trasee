package com.licenta.server.models;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(	name = "usersinfo")
public class UserInfo {
    @Id
    @Column(name = "user_id")
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name")
    private String first_name;
    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name")
    private String last_name;

    @Column(name = "description")
    private String description;

    @Column(name = "speed")
    private Float speed;


    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public UserInfo() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public UserInfo(Long id, String first_name, String last_name, String description, float speed, User user) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.description = description;
        this.speed = speed;
        this.user = user;
    }

    public UserInfo(Long id, String first_name, String last_name, String description, float speed) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.description = description;
        this.speed = speed;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public float getSpeed() {
        return speed;
    }

    public void setSpeed(float speed) {
        this.speed = speed;
    }
}