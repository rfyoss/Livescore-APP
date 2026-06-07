<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiFootballService
{
    protected string $baseUrl = 'https://v3.football.api-sports.io';
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.football.api_key') ?? env('FOOTBALL_API_KEY', '');
    }

    /**
     * Get live football fixtures
     */
    public function getLiveMatches(): array
    {
        Log::info('[ApiFootballService] Retrieving live matches.');
        
        $response = Http::withHeaders([
            'x-rapidapi-host' => 'v3.football.api-sports.io',
            'x-rapidapi-key' => $this->apiKey
        ])->get("{$this->baseUrl}/fixtures", [
            'live' => 'all'
        ]);

        if ($response->successful()) {
            return $response->json()['response'] ?? [];
        }

        Log::error("[ApiFootballService] Live matches fetch failed: " . $response->body());
        return [];
    }

    /**
     * Get upcoming league fixtures
     */
    public function getFixtures(string $leagueId, string $season): array
    {
        Log::info("[ApiFootballService] Fetching upcoming fixtures for league {$leagueId}, season {$season}.");

        $response = Http::withHeaders([
            'x-rapidapi-host' => 'v3.football.api-sports.io',
            'x-rapidapi-key' => $this->apiKey
        ])->get("{$this->baseUrl}/fixtures", [
            'league' => $leagueId,
            'season' => $season
        ]);

        if ($response->successful()) {
            return $response->json()['response'] ?? [];
        }

        Log::error("[ApiFootballService] Fixtures fetch failed: " . $response->body());
        return [];
    }

    /**
     * Get all league teams
     */
    public function getTeams(string $leagueId, string $season): array
    {
        Log::info("[ApiFootballService] Fetching teams for league {$leagueId}, season {$season}.");

        $response = Http::withHeaders([
            'x-rapidapi-host' => 'v3.football.api-sports.io',
            'x-rapidapi-key' => $this->apiKey
        ])->get("{$this->baseUrl}/teams", [
            'league' => $leagueId,
            'season' => $season
        ]);

        if ($response->successful()) {
            return $response->json()['response'] ?? [];
        }

        Log::error("[ApiFootballService] Teams fetch failed: " . $response->body());
        return [];
    }

    /**
     * Get all squad players for a team
     */
    public function getPlayers(int $teamId): array
    {
        Log::info("[ApiFootballService] Fetching squad players for team ID: {$teamId}.");

        $response = Http::withHeaders([
            'x-rapidapi-host' => 'v3.football.api-sports.io',
            'x-rapidapi-key' => $this->apiKey
        ])->get("{$this->baseUrl}/players/squads", [
            'team' => $teamId
        ]);

        if ($response->successful()) {
            return $response->json()['response'] ?? [];
        }

        Log::error("[ApiFootballService] Players fetch failed: " . $response->body());
        return [];
    }

    /**
     * Get current league standings table
     */
    public function getStandings(string $leagueId, string $season): array
    {
        Log::info("[ApiFootballService] Fetching standings for league {$leagueId}, season {$season}.");

        $response = Http::withHeaders([
            'x-rapidapi-host' => 'v3.football.api-sports.io',
            'x-rapidapi-key' => $this->apiKey
        ])->get("{$this->baseUrl}/standings", [
            'league' => $leagueId,
            'season' => $season
        ]);

        if ($response->successful()) {
            return $response->json()['response'] ?? [];
        }

        Log::error("[ApiFootballService] Standings fetch failed: " . $response->body());
        return [];
    }
}
