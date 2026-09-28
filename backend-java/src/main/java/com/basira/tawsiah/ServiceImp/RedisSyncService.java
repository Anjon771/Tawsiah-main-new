package com.basira.tawsiah.ServiceImp;

import org.springframework.dao.QueryTimeoutException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.basira.tawsiah.DTO.Response.EventDetailedResponseDTO;
import com.basira.tawsiah.DTO.Response.PlaceDetailResponseDTO;

@Service
public class RedisSyncService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String EVENT_QUEUE_NAME = "event_sync_queue";
    private final String PLACE_QUEUE_NAME = "place_sync_queue";

    public RedisSyncService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void queueEventForAi(EventDetailedResponseDTO event) {
        try {
            redisTemplate.opsForList().leftPush(EVENT_QUEUE_NAME, event);
            System.out.println("DEBUG: event-add Push successful!");
        } catch (RedisConnectionFailureException | QueryTimeoutException e) {
            System.err.println("WARN: Redis unavailable, skipping event queue. Message: " + e.getMessage());
        }
    }

    public void queueEventForAi(String deleteSignal) {
        try {
            redisTemplate.opsForList().leftPush(EVENT_QUEUE_NAME, deleteSignal);
            System.out.println("DEBUG: event-delete Push successful!");
        } catch (RedisConnectionFailureException | QueryTimeoutException e) {
            System.err.println("WARN: Redis unavailable, skipping event delete queue. Message: " + e.getMessage());
        }
    }

    public void queuePlaceForAi(PlaceDetailResponseDTO placeDTO) {
        try {
            redisTemplate.opsForList().leftPush(PLACE_QUEUE_NAME, placeDTO);
            System.out.println("DEBUG: place-add Push successful!");
        } catch (RedisConnectionFailureException | QueryTimeoutException e) {
            System.err.println("WARN: Redis unavailable, skipping place queue. Message: " + e.getMessage());
        }
    }

    public void queuePlaceForAi(String deleteSignal) {
        try {
            redisTemplate.opsForList().leftPush(PLACE_QUEUE_NAME, deleteSignal);
            System.out.println("DEBUG: place-delete Push successful!");
        } catch (RedisConnectionFailureException | QueryTimeoutException e) {
            System.err.println("WARN: Redis unavailable, skipping place delete queue. Message: " + e.getMessage());
        }
    }
}
