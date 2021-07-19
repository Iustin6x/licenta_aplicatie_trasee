package com.licenta.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(	name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text")
    private String text;

    @Basic
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "time")
    private java.util.Date time;

    @ManyToOne
    @JoinColumn(name = "user_id")

    private User user;

    @ManyToOne
    @JoinColumn(name = "route_id")

    private Route route;

    public Comment() {
    }

    public Comment(String text, Date time) {
        this.text = text;
        this.time = time;
    }

    public Comment(Long id, String text, Date time, User user, Route route) {
        this.id = id;
        this.text = text;
        this.time = time;
        this.user = user;
        this.route = route;
    }

    public Comment(String text, Date time, User user, Route route) {
        this.text = text;
        this.time = time;
        this.user = user;
        this.route = route;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }
}