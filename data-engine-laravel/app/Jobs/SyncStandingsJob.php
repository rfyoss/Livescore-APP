<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\ApiFootballService;
use App\Models\Standing;
use Illuminate\Support\Facades\Log;

class SyncStandingsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $leagueId;
    protected string $season;

    public function __construct(string $leagueId = '39', string $season = '2025')
    {
        $this->leagueId = $leagueId;
        $this->season = $season;
    }

    /**
     * Execute the job.
     */
    public function handle(ApiFootballService $apiService): void
    {
        Log::info("[SyncStandingsJob] Syncing standings for league {$this->leagueId}.");

        $standingsData = $apiService->getStandings($this->leagueId, $this->season);

        if (empty($standingsData)) return;

        $leagueStandings = $standingsData[0]['league']['standings'][0] ?? [];

        foreach ($leagueStandings as $teamStanding) {
            $teamId = $teamStanding['team']['id'];

            Standing::updateOrCreate(
                [
                    'league_id' => $this->leagueId,
                    'team_id' => $teamId
                ],
                [
                    'played' => $teamStanding['all']['played'] ?? 0,
                    'win' => $teamStanding['all']['win'] ?? 0,
                    'draw' => $teamStanding['all']['draw'] ?? 0,
                    'loss' => $teamStanding['all']['lose'] ?? 0,
                    'goals_for' => $teamStanding['all']['goals']['for'] ?? 0,
                    'goals_against' => $teamStanding['all']['goals']['against'] ?? 0,
                    'points' => $teamStanding['points'] ?? 0
                ]
            );
        }

        Log::info('[SyncStandingsJob] Standings synchronized successfully.');
    }
}
