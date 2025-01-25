package com.egame.backend.dto;

import lombok.Data;

@Data
public class BanRequest {
    private String action;  // PERMANENT_BAN, TEMPORARY_BAN, or UNBAN
    private String duration; // Optional, for future use if needed
} 