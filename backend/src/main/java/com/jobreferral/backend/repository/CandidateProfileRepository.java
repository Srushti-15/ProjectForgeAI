package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByEmail(String email);
    boolean existsByEmail(String email);
}
