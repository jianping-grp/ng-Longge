import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestService} from '../../../../service/rest/rest.service';
import {ParamsFile} from '../../../../model/params-file';
import {Router} from '@angular/router';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  stepTwoForm: FormGroup;
  paramsFileList: ParamsFile;
  constrain: any;
  constructor(private rest: RestService,
              private fb: FormBuilder,
              private router: Router) {
    this.constrain = {
      CST_A_chain_name: ['', Validators.required],
      CST_A_residue_name: ['', Validators.required],
      CST_A_residue_ID: ['', Validators.required],
      Atom_A1: ['', Validators.required],
      Atom_A2: ['', Validators.required],
      Atom_A3: ['', Validators.required],
      CST_B_chain_name: ['', Validators.required],
      CST_B_residue_name: ['', Validators.required],
      CST_B_residue_ID: ['', Validators.required],
      Atom_B1: ['', Validators.required],
      Atom_B2: ['', Validators.required],
      Atom_B3: ['', Validators.required],
      atom_type_prefix: ['type1', Validators.required],
      Atom_type: [''],
      atom_A1: [''],
      atom_A2: [''],
      atom_A3: [''],
    };
  }

  ngOnInit() {
    this.stepTwoForm = this.fb.group({
      job_name: ['', Validators.required],
      cat_ID: ['', Validators.required],
      constrain_info: this.fb.array(
        [this.fb.group(this.constrain)
        ]),
    });
  }

  get constrainInfo(): FormArray {
   return this.stepTwoForm.get('constrain_info') as FormArray;
  }

  // get atomTypePrefix() {
  //   return this.stepTwoForm.get('atom_type_prefix').value;
  // }

  addConstrain() {
    this.constrainInfo.push(this.fb.group(this.constrain));
    console.log('constrainInfo:', this.constrainInfo);
  }

  removeConstrain() {
    this.constrainInfo.controls.pop();
  }

  onSubmit() {
    const form = this.stepTwoForm.value;
    if (this.stepTwoForm.invalid) { // 表单无效
      for (const i in this.stepTwoForm.controls) {
        // console.log('stepForm:', this.stepTwoForm.controls);
        this.stepTwoForm.controls[i].markAsDirty();
        this.stepTwoForm.controls[i].updateValueAndValidity();
      }
      // constrain_info 表单错误处理
      this.constrainInfo.invalid ? alert('please input the complete constrains!') : null;
    } else { // 判断文件 Atom type
       // Atom type value is null
      for (const constrain of form.constrain_info) {
        if (constrain.atom_type_prefix === 'type1' && !constrain.Atom_type) {
        alert('Please input atom type!');
      } else if (constrain.atom_type_prefix === 'type2' && (!constrain.atom_A1 || !constrain.atom_A2 || !constrain.atom_A3)) {
        alert('Please input atom type!');
      } else { // upload form
          this.uploadForm();
          console.log(this.stepTwoForm.value);
        }
      }
    }
  }

  uploadForm() {
    const form = this.stepTwoForm.value;
    const formData = new FormData();
    let constrainValue = '';
    // constrain_info 数据格式处理
    for (const constrain of form.constrain_info) {
      const constrainArray = [];
      constrainArray.push(
        constrain['CST_A_chain_name'].trim(),
        constrain['CST_A_residue_ID'].trim(),
        constrain['CST_A_residue_name'].trim(),
        constrain['Atom_A1'].trim(),
        constrain['Atom_A2'].trim(),
        constrain['Atom_A3'].trim(),
        constrain['CST_B_chain_name'].trim(),
        constrain['CST_B_residue_ID'].trim(),
        constrain['CST_B_residue_name'].trim(),
        constrain['Atom_B1'].trim(),
        constrain['Atom_B2'].trim(),
        constrain['Atom_B3'].trim(),
      );
      console.log('constainArray:', constrainArray,
        'constrain:', constrain, 'constrainInfo',
        this.constrainInfo, 'info:', form.constrain_info); // todo delete
      constrainValue += constrainArray.join(':');
      if (constrain.atom_type_prefix === 'type1') {
        constrainValue += '-type:' + constrain.Atom_type.trim() + ':';
      } else if (constrain['atom_type_prefix'] === 'type2') {
        constrainValue += '-' + constrain['atom_A1'].trim() + ':' + constrain['atom_A2'].trim() + ':' + constrain['atom_A3'].trim() + ':';
      }
    }
    // console.log('constrainValue:', constrainValue);
    // 移除最后一个冒号
    constrainValue = constrainValue.slice(0, -1);
    console.log('constrainValue:', constrainValue);
    formData.append('job_name', form.job_name.trim());
    formData.append('cat_ID', form.cat_ID.trim());
    formData.append('constrain_info', constrainValue);
    this.rest.postData('second-step/', formData)
      .subscribe(data => {
        // this.paramsFileList = data;
          alert('Submitted Successfully!');
      },
      error => {
        console.log(error.message);
        alert('Submitted Failed');
      },
        () => {
        this.router.navigate(['manual-design/manual-design/step-two-result'], {
          queryParams: {
            // paramsFileList: this.paramsFileList
            jobName: form.job_name
          }});
        });
  }


}
