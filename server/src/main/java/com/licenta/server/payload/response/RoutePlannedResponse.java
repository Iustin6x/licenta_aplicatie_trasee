package com.licenta.server.payload.response;

import com.licenta.server.models.Point;

import java.util.Date;
import java.util.Set;

public class RoutePlannedResponse {
    private Long id;
    private String name;

    private Float distance;

    private java.util.Date start_date;

    private String username;
    private Long user_id;

    private Set<Point> points;

    private String type;

    public RoutePlannedResponse(String name, Float distance, Date start_date, String username, Long user_id, Set<Point> points, String type) {
        this.name = name;
        this.distance = distance;
        this.start_date = start_date;
        this.username = username;
        this.user_id = user_id;
        this.points = points;
        this.type = type;
    }

    public RoutePlannedResponse(Long id, String name, Float distance, Date start_date, String username, Long user_id, Set<Point> points, String type) {
        this.id = id;
        this.name = name;
        this.distance = distance;
        this.start_date = start_date;
        this.username = username;
        this.user_id = user_id;
        this.points = points;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getDistance() {
        return distance;
    }

    public void setDistance(Float distance) {
        this.distance = distance;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Set<Point> getPoints() {
        return points;
    }

    public void setPoints(Set<Point> points) {
        this.points = points;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
