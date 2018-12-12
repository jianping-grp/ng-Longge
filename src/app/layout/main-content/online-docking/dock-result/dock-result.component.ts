import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../../service/rest/rest.service';
import {GlobalService} from '../../../../service/global/global.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Onlinedock} from '../../../../model/onlinedock';

@Component({
  selector: 'app-dock-result',
  templateUrl: './dock-result.component.html',
  styleUrls: ['./dock-result.component.css']
})
export class DockResultComponent implements OnInit {
  onlinedock: Onlinedock;
  constructor(private route: ActivatedRoute,
              private rest: RestService,
              private globalService: GlobalService) { }

  ngOnInit() {
    this._getOnlinedockResule();
  }

  private _getOnlinedockResule() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const jobName = params.get('jobName');
      this.rest.getData(`onlinedock/?filter{job_name}=${jobName}`)
        .subscribe(data => {
          this.onlinedock = data['onlinedocks'][0];
        });
    });
  }

}
