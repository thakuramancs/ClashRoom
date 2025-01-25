package com.egame.backend.schedulers;

import com.egame.backend.services.MatchService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MatchStatusScheduler {
    private final MatchService matchService;

    public MatchStatusScheduler(MatchService matchService) {
        this.matchService = matchService;
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    public void updateMatchStatuses() {
        matchService.updateMatchStatuses();
    }
} 