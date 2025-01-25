package com.egame.backend.controllers;

import com.egame.backend.models.Match;
import com.egame.backend.models.PlayerMatch;
import com.egame.backend.services.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.egame.backend.dto.ErrorResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.egame.backend.dto.PlayerMatchDTO;
import com.egame.backend.models.PlayerMatch;
import org.springframework.http.HttpStatus;
import com.egame.backend.dto.RoomDetailsRequest;
import com.egame.backend.dto.MatchDetailsDTO;
import com.egame.backend.dto.MatchDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.egame.backend.dto.MessageResponse;


@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {
    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<?> getAllMatches() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<MatchDTO> matches = matchService.getAllMatchesWithJoinStatus(username);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMatch(@RequestBody Match match) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("Only administrators can create matches"));
            }
            Match createdMatch = matchService.createMatch(match);
            return ResponseEntity.ok(createdMatch);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{matchId}/join")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> joinMatch(@PathVariable Long matchId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Match match = matchService.joinMatch(matchId, username);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{matchId}/players")
    public ResponseEntity<?> getMatchPlayers(@PathVariable Long matchId) {
        try {
            System.out.println("Controller: Fetching players for match ID: " + matchId);
            List<PlayerMatchDTO> players = matchService.getMatchPlayers(matchId);
            System.out.println("Controller: Found " + players.size() + " players");
            return ResponseEntity.ok(players);
        } catch (Exception e) {
            System.out.println("Controller: Error getting match players: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to get players: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{matchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMatch(@PathVariable Long matchId) {
        try {
            // Check if match exists
            Match match = matchService.getMatch(matchId);
            if (match == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if match has players
            List<PlayerMatchDTO> players = matchService.getMatchPlayers(matchId);
            if (!players.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Cannot delete match with registered players"));
            }

            // Proceed with deletion
            matchService.deleteMatch(matchId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<?> getMatch(@PathVariable Long matchId) {
        try {
            System.out.println("Controller: Fetching match with ID: " + matchId);
            Match match = matchService.getMatch(matchId);
            System.out.println("Controller: Found match: " + match);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            System.out.println("Controller: Error getting match: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to get match: " + e.getMessage()));
        }
    }

    @PatchMapping("/{matchId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelMatch(@PathVariable Long matchId) {
        try {
            Match cancelledMatch = matchService.cancelMatch(matchId);
            return ResponseEntity.ok(cancelledMatch);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMatch(@PathVariable Long id, @RequestBody Match updatedMatch) {
        try {
            Match match = matchService.updateMatch(id, updatedMatch);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/room-details")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRoomDetails(
            @PathVariable Long id,
            @RequestBody RoomDetailsRequest request) {
        try {
            Match match = matchService.updateRoomDetails(id, request.getRoomId(), request.getRoomPassword());
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getMatchDetails(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("User: " + auth.getName());
            System.out.println("Authorities: " + auth.getAuthorities());
            
            String username = auth.getName();
            MatchDetailsDTO details = matchService.getMatchDetails(id, username);
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            System.out.println("Error in getMatchDetails: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/exit")
    public ResponseEntity<?> exitMatch(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            matchService.exitMatch(id, userDetails.getUsername());
            return ResponseEntity.ok().body(new MessageResponse("Successfully exited from match"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
} 