package com.egame.backend.repositories;

import com.egame.backend.models.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
} 