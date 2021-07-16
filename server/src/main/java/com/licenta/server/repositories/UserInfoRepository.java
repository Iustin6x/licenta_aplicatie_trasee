package com.licenta.server.repositories;
import java.util.List;
import java.util.Optional;

import com.licenta.server.models.User;
import com.licenta.server.models.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    List<UserInfo> findAll();
    Optional<UserInfo> findById(long id);
    Optional<UserInfo> findByUserUsername(String username);
    Boolean deleteById(long id);
}
