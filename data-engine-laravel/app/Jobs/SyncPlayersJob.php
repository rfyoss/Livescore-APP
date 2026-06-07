<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\ApiFootballService;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Support0\Facades\Log;

class SyncPlayersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(ApiFootballService $apiService): void
    {
        Log::info('[SyncPlayersJob] Gathering active athletes profiles and rosters.');

        // Grab all teams pre-saved to iterate
        $teams = Team::all();

        foreach ($teams as $team) {
            $playersFeed = $apiService->getPlayers($team->id);

            if (empty($playersFeed)) continue;

            $playersList = $playersFeed[0]['players'] ?? [];

            foreach ($playersList as $pItem) {
                Player::updateOrCreate(
                    ['id' => $pItem['id']],
                    [
                        'team_id' => $team->id,
                        'name' => $pItem['name'],
                        'age' => $pItem['number'] ?? rand(20, 35), // fallback age metrics if absent
                        'nationality' => $team->country,
                        'position' => $pItem['position'] ?? 'Midfielder',
                        'photo' => $pItem['photo'] ?? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2'
                    ]
                );
            }

            // Rate-limit safety for external football sports APIs
            sleep(1);
        }

        Log::info('[SyncPlayersJob] Successfully updated all squad rosters.');
    }
}
