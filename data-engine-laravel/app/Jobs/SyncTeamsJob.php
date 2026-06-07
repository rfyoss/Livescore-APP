<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\ApiFootballService;
use App\Models\Team;
use Illuminate\Support\Facades\Log;

class SyncTeamsJob implements ShouldQueue
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
        Log::info("[SyncTeamsJob] Sycing teams list for league: {$this->leagueId}.");

        $teams = $apiService->getTeams($this->leagueId, $this->season);

        if (empty($teams)) return;

        foreach ($teams as $item) {
            $tData = $item['team'];
            $vData = $item['venue'] ?? [];

            Team::updateOrCreate(
                ['id' => $tData['id']],
                [
                    'name' => $tData['name'],
                    'logo' => $tData['logo'],
                    'country' => $tData['country'] ?? '',
                    'founded' => $tData['founded'] ?? 1900,
                    'venue' => $vData['name'] ?? 'Home Ground Stadium'
                ]
            );
        }

        Log::info('[SyncTeamsJob] Completed club teams synchronizations.');
    }
}
