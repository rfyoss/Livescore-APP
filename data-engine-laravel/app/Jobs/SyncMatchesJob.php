<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\ApiFootballService;
use App\Models\Match;
use Illuminate\Support\Facades\Log;

class SyncMatchesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(ApiFootballService $apiService): void
    {
        Log::info('[SyncMatchesJob] Running synchronized football sync pipeline.');

        $liveFixtures = $apiService->getLiveMatches();

        if (empty($liveFixtures)) {
            Log::info('[SyncMatchesJob] No active live matches reported.');
            return;
        }

        foreach ($liveFixtures as $fixture) {
            $fId = $fixture['fixture']['id'];
            $leagueId = $fixture['league']['id'];
            $homeId = $fixture['teams']['home']['id'];
            $awayId = $fixture['teams']['away']['id'];

            $statusText = 'UPCOMING';
            $statusShort = $fixture['fixture']['status']['short'] ?? '';
            
            if (in_array($statusShort, ['1H', '2H', 'HT', 'ET', 'P'])) {
                $statusText = 'LIVE';
            } elseif (in_array($statusShort, ['FT', 'AET', 'PEN'])) {
                $statusText = 'FINISHED';
            }

            Match::updateOrCreate(
                ['id' => $fId],
                [
                    'league_id' => String($leagueId),
                    'home_team_id' => $homeId,
                    'away_team_id' => $awayId,
                    'match_date' => $fixture['fixture']['date'],
                    'status' => $statusText,
                    'home_score' => $fixture['goals']['home'] ?? 0,
                    'away_score' => $fixture['goals']['away'] ?? 0
                ]
            );
        }

        Log::info('[SyncMatchesJob] Successfully synced live games.');
    }
}
