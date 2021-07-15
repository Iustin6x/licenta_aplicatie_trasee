package com.licenta.server.repositories;

import java.util.Optional;

import com.licenta.server.models.ImageModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageModel, Long> {
    Optional<ImageModel> findByName(String name);
}