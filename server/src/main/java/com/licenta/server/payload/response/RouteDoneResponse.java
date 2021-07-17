package com.licenta.server.payload.response;

import com.licenta.server.models.Point;

import java.util.Date;
import java.util.Set;

public class RouteDoneResponse {
    private Long id;
    private String name;

    private String description;

    private Float distance;

    private Float speed;

    private java.util.Date start_date;

    private java.util.Date finish_date;

    private String username;
    private Long user_id;

    private Set<Point> points;

    private String type;

    public RouteDoneResponse() {
    }

    public RouteDoneResponse(Long id, String name, String description, Float distance, Float speed, Date start_date, Date finish_date, String username, Long user_id, Set<Point> points, String type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.distance = distance;
        this.speed = speed;
        this.start_date = start_date;
        this.finish_date = finish_date;
        this.username = username;
        this.user_id = user_id;
        this.points = points;
        this.type = type;
    }

    public RouteDoneResponse(String name, String description, Float distance, Float speed, Date start_date, Date finish_date, String username,Long user_id, Set<Point> points, String type) {
        this.name = name;
        this.description = description;
        this.distance = distance;
        this.speed = speed;
        this.start_date = start_date;
        this.finish_date = finish_date;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getDistance() {
        return distance;
    }

    public void setDistance(Float distance) {
        this.distance = distance;
    }

    public Float getSpeed() {
        return speed;
    }

    public void setSpeed(Float speed) {
        this.speed = speed;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getFinish_date() {
        return finish_date;
    }

    public void setFinish_date(Date finish_date) {
        this.finish_date = finish_date;
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
